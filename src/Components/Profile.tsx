import React from 'react';
import { Button } from 'flowbite-react';

export default function Profile() {
  return (
    <div className="p-4">
      <Button color="blue" onClick={() => alert('Flowbite works!')}>
        Flowbite Button
      </Button>
    </div>
  );
}
