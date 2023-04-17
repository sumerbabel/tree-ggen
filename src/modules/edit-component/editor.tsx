import { useEffect, useState } from 'react'
import { History } from './History'
import { Record } from './Record'

type Padding<T> = T | { top?: T, right?: T, bottom?: T, left?: T }

type Props = React.HTMLAttributes<HTMLDivElement> & {
  value: string
  onValueChange: (value: string) => void
  highlight: (value: string) => string | React.ReactNode
  tabSize: number
  insertSpaces: boolean
  ignoreTabKey: boolean
  padding: Padding<number | string>
  style?: React.CSSProperties
  textareaId?: string
  textareaClassName?: string
  autoFocus?: boolean
  disabled?: boolean
  form?: string
  maxLength?: number
  minLength?: number
  name?: string
  placeholder?: string
  readOnly?: boolean
  required?: boolean
  onClick?: React.MouseEventHandler<HTMLTextAreaElement>
  onFocus?: React.FocusEventHandler<HTMLTextAreaElement>
  onBlur?: React.FocusEventHandler<HTMLTextAreaElement>
  onKeyUp?: React.KeyboardEventHandler<HTMLTextAreaElement>
  onKeyDown?: React.KeyboardEventHandler<HTMLTextAreaElement>
  preClassName?: string
}

const KEYCODE_Y = 89
const KEYCODE_Z = 90
const KEYCODE_M = 77
const KEYCODE_PARENS = 57
const KEYCODE_BRACKETS = 219
const KEYCODE_QUOTE = 222
const KEYCODE_BACK_QUOTE = 192

const HISTORY_LIMIT = 100
const HISTORY_TIME_GAP = 3000

const isWindows =
  typeof window !== 'undefined' &&
  'navigator' in window &&
  /Win/i.test(navigator.platform)
const isMacLike =
  typeof window !== 'undefined' &&
  'navigator' in window &&
  /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform)

const className = 'npm__react-simple-code-editor__textarea'

const cssText = /* CSS */ `
/**
 * Reset the text fill color so that placeholder is visible
 */
.${className}:empty {
  -webkit-text-fill-color: inherit !important;
}

/**
 * Hack to apply on some CSS on IE10 and IE11
 */
@media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {
  /**
    * IE doesn't support '-webkit-text-fill-color'
    * So we use 'color: transparent' to make the text transparent on IE
    * Unlike other browsers, it doesn't affect caret color in IE
    */
  .${className} {
    color: transparent !important;
  }

  .${className}::selection {
    background-color: #accef7 !important;
    color: transparent !important;
  }
}
`

export default function Editor (props: Props): JSX.Element {
  const [state, setState] = useState({ capture: true })

  useEffect(() => {
    _recordCurrentState()
  }, [])

  const _recordCurrentState = (): void => {
    const input = _input

    if (input == null) return
    const { value, selectionStart, selectionEnd } = input

    _recordChange({
      value,
      selectionStart,
      selectionEnd
    })
  }

  const _getLines = (text: string, position: number): string[] =>
    text.substring(0, position).split('\n')

  const _recordChange = (record: Record, overwrite: boolean = false): void => {
    const { stack, offset } = _history

    if ((stack.length > 0) && offset > -1) {
      _history.stack = stack.slice(0, offset + 1)
      const count = _history.stack.length

      if (count > HISTORY_LIMIT) {
        const extras = count - HISTORY_LIMIT

        _history.stack = stack.slice(extras, count)
        _history.offset = Math.max(_history.offset - extras, 0)
      }
    }

    const timestamp = Date.now()

    if (overwrite) {
      const last = _history.stack[_history.offset]

      if (last !== undefined && timestamp - last.timestamp < HISTORY_TIME_GAP) {
        const re = /[^a-z0-9]([a-z0-9]+)$/i

        const previous = _getLines(last.value, last.selectionStart)
          .pop()
          ?.match(re)

        const current = _getLines(record.value, record.selectionStart)
          .pop()
          ?.match(re)

        if (previous?.[1] !== undefined && current?.[1]?.startsWith(previous[1]) !== undefined) {
          _history.stack[_history.offset] = { ...record, timestamp }

          return
        }
      }
    }

    _history.stack.push({ ...record, timestamp })
    _history.offset++
  }

  const _updateInput = (record: Record): void => {
    const input = _input

    if (input == null) return
    input.value = record.value
    input.selectionStart = record.selectionStart
    input.selectionEnd = record.selectionEnd

    props.onValueChange(record.value)
  }

  const _applyEdits = (record: Record): void => {
    const input = _input
    const last = _history.stack[_history.offset]

    if (last !== undefined && (input != null)) {
      _history.stack[_history.offset] = {
        ...last,
        selectionStart: input.selectionStart,
        selectionEnd: input.selectionEnd
      }
    }
    _recordChange(record)
    _updateInput(record)
  }

  const _undoEdit = (): void => {
    const { stack, offset } = _history
    const record = stack[offset - 1]

    if (record !== undefined) {
      _updateInput(record)
      _history.offset = Math.max(offset - 1, 0)
    }
  }

  const _redoEdit = (): void => {
    const { stack, offset } = _history
    const record = stack[offset + 1]

    if (record !== undefined) {
      _updateInput(record)
      _history.offset = Math.min(offset + 1, stack.length - 1)
    }
  }

  const _handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
    const { tabSize, insertSpaces, ignoreTabKey, onKeyDown } = props

    if (onKeyDown != null) {
      onKeyDown(e)

      if (e.defaultPrevented) {
        return
      }
    }

    if (e.key === 'Escape') {
      e.currentTarget.blur()
    }

    const { value, selectionStart, selectionEnd } = e.currentTarget

    const tabCharacter = (insertSpaces ? ' ' : '\t').repeat(tabSize)

    if (e.key === 'Tab' && !ignoreTabKey && state.capture) {
      e.preventDefault()

      if (e.shiftKey) {
        const linesBeforeCaret = _getLines(value, selectionStart)
        const startLine = linesBeforeCaret.length - 1
        const endLine = _getLines(value, selectionEnd).length - 1
        const nextValue = value
          .split('\n')
          .map((line, i) => {
            if (
              i >= startLine &&
              i <= endLine &&
              line.startsWith(tabCharacter)
            ) {
              return line.substring(tabCharacter.length)
            }

            return line
          })
          .join('\n')

        if (value !== nextValue) {
          const startLineText = linesBeforeCaret[startLine]

          _applyEdits({
            value: nextValue,
            selectionStart: startLineText?.startsWith(tabCharacter)
              ? selectionStart - tabCharacter.length
              : selectionStart,
            selectionEnd: selectionEnd - (value.length - nextValue.length)
          })
        }
      } else if (selectionStart !== selectionEnd) {
        const linesBeforeCaret = _getLines(value, selectionStart)
        const startLine = linesBeforeCaret.length - 1
        const endLine = _getLines(value, selectionEnd).length - 1
        const startLineText = linesBeforeCaret[startLine]

        _applyEdits({
          value: value
            .split('\n')
            .map((line, i) => {
              if (i >= startLine && i <= endLine) {
                return tabCharacter + line
              }

              return line
            })
            .join('\n'),

          selectionStart:
            startLineText !== undefined && /\S/.test(startLineText)
              ? selectionStart + tabCharacter.length
              : selectionStart,
          selectionEnd:
            selectionEnd + tabCharacter.length * (endLine - startLine + 1)
        })
      } else {
        const updatedSelection = selectionStart + tabCharacter.length

        _applyEdits({
          value:
            value.substring(0, selectionStart) +
            tabCharacter +
            value.substring(selectionEnd),
          selectionStart: updatedSelection,
          selectionEnd: updatedSelection
        })
      }
    } else if (e.key === 'Backspace') {
      const hasSelection = selectionStart !== selectionEnd
      const textBeforeCaret = value.substring(0, selectionStart)

      if (textBeforeCaret.endsWith(tabCharacter) && !hasSelection) {
        e.preventDefault()

        const updatedSelection = selectionStart - tabCharacter.length

        _applyEdits({
          // Remove tab character at caret
          value:
            value.substring(0, selectionStart - tabCharacter.length) +
            value.substring(selectionEnd),
          // Update caret position
          selectionStart: updatedSelection,
          selectionEnd: updatedSelection
        })
      }
    } else if (e.key === 'Enter') {
      // Ignore selections
      if (selectionStart === selectionEnd) {
        // Get the current line
        const line = _getLines(value, selectionStart).pop()
        const matches = line?.match(/^\s+/)

        if (matches?.[0] !== undefined) {
          e.preventDefault()

          // Preserve indentation on inserting a new line
          const indent = '\n' + matches[0]
          const updatedSelection = selectionStart + indent.length

          _applyEdits({
            // Insert indentation character at caret
            value:
              value.substring(0, selectionStart) +
              indent +
              value.substring(selectionEnd),
            // Update caret position
            selectionStart: updatedSelection,
            selectionEnd: updatedSelection
          })
        }
      }
    } else if (
      e.keyCode === KEYCODE_PARENS ||
      e.keyCode === KEYCODE_BRACKETS ||
      e.keyCode === KEYCODE_QUOTE ||
      e.keyCode === KEYCODE_BACK_QUOTE
    ) {
      let chars

      if (e.keyCode === KEYCODE_PARENS && e.shiftKey) {
        chars = ['(', ')']
      } else if (e.keyCode === KEYCODE_BRACKETS) {
        if (e.shiftKey) {
          chars = ['{', '}']
        } else {
          chars = ['[', ']']
        }
      } else if (e.keyCode === KEYCODE_QUOTE) {
        if (e.shiftKey) {
          chars = ['"', '"']
        } else {
          chars = ["'", "'"]
        }
      } else if (e.keyCode === KEYCODE_BACK_QUOTE && !e.shiftKey) {
        chars = ['`', '`']
      }

      // If text is selected, wrap them in the characters
      if (selectionStart !== selectionEnd && (chars != null)) {
        e.preventDefault()

        _applyEdits({
          value:
            value.substring(0, selectionStart) +
            chars[0] +
            value.substring(selectionStart, selectionEnd) +
            chars[1] +
            value.substring(selectionEnd),
          // Update caret position
          selectionStart,
          selectionEnd: selectionEnd + 2
        })
      }
    } else if (
      (isMacLike ? e.metaKey && e.keyCode === KEYCODE_Z : e.ctrlKey && e.keyCode === KEYCODE_Z) &&
      !e.shiftKey &&
      !e.altKey
    ) {
      e.preventDefault()

      _undoEdit()
    } else if (
      (isMacLike
        ? e.metaKey && e.keyCode === KEYCODE_Z && e.shiftKey
        : isWindows ? e.ctrlKey && e.keyCode === KEYCODE_Y : e.ctrlKey && e.keyCode === KEYCODE_Z && e.shiftKey) &&
      !e.altKey
    ) {
      e.preventDefault()

      _redoEdit()
    } else if (
      e.keyCode === KEYCODE_M &&
      e.ctrlKey &&
      (isMacLike ? e.shiftKey : true)
    ) {
      e.preventDefault()

      // Toggle capturing tab key so users can focus away
      setState((state) => ({
        capture: !state.capture
      }))
    }
  }

  const _handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    const { value, selectionStart, selectionEnd } = e.currentTarget

    _recordChange(
      {
        value,
        selectionStart,
        selectionEnd
      },
      true
    )

    props.onValueChange(value)
  }

  const _history: History = {
    stack: [],
    offset: -1
  }

  let _input: HTMLTextAreaElement | null = null

  // function getSession (): { history: History } {
  //   return {
  //     history: _history
  //   }
  // }

  // function setSession (session: { history: History }): void {
  //   _history = session.history
  // }

  const {
    value,
    style,
    padding,
    highlight,
    textareaId,
    textareaClassName,
    autoFocus,
    disabled,
    form,
    maxLength,
    minLength,
    name,
    placeholder,
    readOnly,
    required,
    onClick,
    onFocus,
    onBlur,
    onKeyUp,
    /* eslint-disable @typescript-eslint/no-unused-vars */
    onKeyDown,
    onValueChange,
    tabSize,
    insertSpaces,
    ignoreTabKey,
    /* eslint-enable @typescript-eslint/no-unused-vars */
    preClassName,
    ...rest
  } = props

  const contentStyle = {
    paddingTop: typeof padding === 'object' ? padding.top : padding,
    paddingRight: typeof padding === 'object' ? padding.right : padding,
    paddingBottom: typeof padding === 'object' ? padding.bottom : padding,
    paddingLeft: typeof padding === 'object' ? padding.left : padding
  }

  const highlighted = highlight(value)

  return (
    <div {...rest} style={{ ...styles.container, ...style }}>
      <pre
        className={preClassName}
        aria-hidden='true'
        style={{ ...styles.editor, ...styles.highlight, ...contentStyle }}
        {...(typeof highlighted === 'string'
          ? { dangerouslySetInnerHTML: { __html: highlighted + '<br />' } }
          : { children: highlighted })}
      />
      <textarea
        ref={(c) => (_input = c)}
        style={{
          ...styles.editor,
          ...styles.textarea,
          ...contentStyle
        }}
        className={
          className + (textareaClassName !== undefined ? ` ${textareaClassName}` : '')
        }
        id={textareaId}
        value={value}
        onChange={_handleChange}
        onKeyDown={_handleKeyDown}
        onClick={onClick}
        onKeyUp={onKeyUp}
        onFocus={onFocus}
        onBlur={onBlur}
        disabled={disabled}
        form={form}
        maxLength={maxLength}
        minLength={minLength}
        name={name}
        placeholder={placeholder}
        readOnly={readOnly}
        required={required}
        autoFocus={autoFocus}
        autoCapitalize='off'
        autoComplete='off'
        autoCorrect='off'
        spellCheck={false}
        data-gramm={false}
      />
      {/* eslint-disable-next-line react/no-danger */}
      <style dangerouslySetInnerHTML={{ __html: cssText }} />
    </div>
  )
}

const styles = {
  container: {
    position: 'relative',
    textAlign: 'left',
    boxSizing: 'border-box',
    padding: 0,
    overflow: 'hidden'
  },
  textarea: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: '100%',
    resize: 'none',
    color: 'inherit',
    overflow: 'hidden',
    MozOsxFontSmoothing: 'grayscale',
    WebkitFontSmoothing: 'antialiased',
    WebkitTextFillColor: 'transparent'
  },
  highlight: {
    position: 'relative',
    pointerEvents: 'none'
  },
  editor: {
    margin: 0,
    border: 0,
    background: 'none',
    boxSizing: 'inherit',
    display: 'inherit',
    fontFamily: 'inherit',
    fontSize: 'inherit',
    fontStyle: 'inherit',
    fontVariantLigatures: 'inherit',
    fontWeight: 'inherit',
    letterSpacing: 'inherit',
    lineHeight: 'inherit',
    tabSize: 'inherit',
    textIndent: 'inherit',
    textRendering: 'inherit',
    textTransform: 'inherit',
    whiteSpace: 'pre-wrap',
    wordBreak: 'keep-all',
    overflowWrap: 'break-word'
  }
} as const
