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
        setTimeout(() => setShowAlert(false), props.time);
    }

  return (
    <>
      {showAlert &&
        <div className={`alert alert-${props.variant} alert-dismissible fade show`} role="alert">
          {props.message}
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
      }
    </>
  );
}

export default UserMessage;