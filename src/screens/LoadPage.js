import React, { useState, useEffect } from 'react';

const LoadPage = () => {

  const [ loadIndex, setLoadIndex ] = useState(0);
  const loads = [
    <>.&nbsp;&nbsp;</>,
    <>..&nbsp;</>,
    <>...</>,
    <>&nbsp;..</>,
    <>&nbsp;&nbsp;.</>,
    <>&nbsp;&nbsp;&nbsp;</>
  ];

  useEffect(() => {
    setTimeout(() => {
      if ( loadIndex >= (loads.length - 1)) {
        setLoadIndex(0);
      } else {
        setLoadIndex(loadIndex + 1);
      }
    }, 90);
  }, [ loadIndex ]);

  return (
    <div className="content text-center bg-primary py-5">
      <div>
        <i style={{ color: 'white', marginBottom: '10px' }} className="fa fa-refresh fa-spin fa-2x" aria-hidden="true"></i>
      </div>
      <span className="text-white">
        Loading<code className="text-white">{loads[loadIndex]}</code>
      </span>
    </div>
  );
};

export default LoadPage;
