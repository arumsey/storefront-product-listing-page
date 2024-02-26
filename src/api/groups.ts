/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

type GroupItem = {
  id: number,
  name: string,
}

const sonyGroupMap: Record<string, ReadonlyArray<GroupItem>> = {
  sonybt_product_type: [
    {
      id: 16146,
      name: 'Antibodies Single'
    },
    {
      id: 16146,
      name: 'Primary Antibody'
    },
    {
      id: 16146,
      name: 'Secondary Antibody'
    },
    {
      id: 16146,
      name: '2nd Step (non-Ab)'
    },
    {
      id: 16146,
      name: 'Beads'
    }, {
      id: 16146,
      name: 'Buffer/Solution/Chemical'
    },
    {
      id: 16146,
      name: 'Buffers/Solutions'
    },
    {
      id: 16146,
      name: 'Cocktail'
    },
    {
      id: 16146,
      name: 'Fluids & Cleaning'
    },
    {
      id: 16146,
      name: 'Isotype Control'
    },
    {
      id: 16146,
      name: 'Isotype controls/lysates'
    },
    {
      id: 16146,
      name: 'Microfluidics Chips'
    },
    {
      id: 16146,
      name: 'Parts/Accessories'
    },
    {
      id: 16146,
      name: 'Probes'
    },
    {
      id: 16146,
      name: 'lines'
    },
    {
      id: 16146,
      name: 'filters'
    },
    {
      id: 16146,
      name: 'Recombinant Protein'
    },
    {
      id: 16146,
      name: 'Recombinant Protein'
    },
    {
      id: 16146,
      name: 'Second Step (non-Ab)'
    },
    {
      id: 0,
      name: 'N/A'
    },
  ],
};


export { sonyGroupMap };

