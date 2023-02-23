import React, { useState, useEffect } from 'react';

const UserMessage = (props) => {  
  
    const [showAlert, setShowAlert] = useState(false);

    useEffect(() => {
        if (props.triggerAlert) {
          displayAlert();
        }
      }, [props.triggerAlert]);

    const displayAlert = () => {  
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 5000);
    }

  return (
    <>
      {showAlert &&
        <div className={`alert alert-${props.variant} alert-dismissible fade show`} role="alert">
          {props.message}
        </div>
      }
    </>
  );
}

export default UserMessage;