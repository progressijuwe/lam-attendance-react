export const formFields = [
  {
    type: 'text',
    id: 'firstName',
    name: 'firstName',
    label: 'First Name',
    placeholder: 'Write here',
    required: true,
  },
  {
    type: 'text',
    id: 'lastName',
    name: 'lastName',
    label: 'Last Name',
    placeholder: 'Write here',
    required: true,
  },
  {
    type: 'select',
    id: 'department',
    name: 'department',
    label: 'Department',
    required: true,
    options: [
      { value: '', label: 'Department' },
      { value: 'assimilation', label: 'Assimilation' },
      { value: 'choir', label: 'Choir' },
      { value: 'media', label: 'Media' },
      { value: 'protocol', label: 'Protocol' },
      { value: 'technical', label: 'Technical' },
      { value: 'ushering', label: 'Ushering' },
    ],
  },
  {
    type: 'file',
    id: 'liveImage',
    name: 'liveImage',
    label: 'Your Live Picture',
    accept: 'image/*',
    required: true,
  }
]