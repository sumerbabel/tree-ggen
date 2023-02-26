export const DATA = 
	{
		id: '1',
		label: 'nivel 1',
		isOpen:true,
		level:0,
		children: [
			{
				id: '2',
				label: 'nivel 1.1',
				parentId:'1',
				isOpen:true,
				level:1,
			},
			{
				id: '3',
				label: 'nivel 1.2',
				parentId:'1',
				isOpen:true,
				level:1,
				children: [
					{
						id: '4',
						label: 'nivel 1.2.1',
						parentId:'3',
						isOpen:true,
						level:2,
					},
					{
						id: '5',
						label: 'nivel 1.2.2',
						parentId:'3',
						isOpen:true,
						level:2,
					},
				],
			},

			{
				id: '6',
				label: 'Nivel 2',
				parentId:'1',
				isOpen:true,
				level:1,
				children: [
					{
						id: '7',
						label: 'nivel 2.1',
						parentId:'6',
						isOpen:true,
						level:2,
					},
					{
						id: '8',
						label: 'nivel 2.2k',
						parentId:'6',
						isOpen:true,
						level:2,
					},
				],
			},

		],
	}

export const DATA2 = [
	{
		id: '1',
		label: 'Food',
	}
];