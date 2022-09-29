import React from 'react'

export default function Loader() {
  let circleCommonClasses = 'h-3 w-3 bg-current rounded-full text-primary';

  return (
    <div className='dark:bg-neutral flex items-center justify-center min-h-screen h-full'>
        <div className={`${circleCommonClasses} mr-1 animate-bounce dark:bg-neutral`}></div>
        <div className={`${circleCommonClasses} mr-1 animate-bounce200 dark:bg-neutral`}></div>
        <div className={`${circleCommonClasses} mr-1 animate-bounce300 dark:bg-neutral`}></div>
    </div>
  );
}
