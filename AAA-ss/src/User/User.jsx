import React from "react";
import "./user.css"; // Importing the CSS file
import myImage1 from "../Images/A1.png";
import myImage2 from "../Images/A2.png";
import myImage3 from "../Images/A3.png";

const User = () => {
  return (
    <div className="user-container">
      <h1 className="blue-heading">Welcome User!</h1>
      <p className="aaa-paragraph">
        Authentication, Authorization, and Accounting (AAA) are core principles
        in the security of networked and distributed systems. AAA protocols
        ensure that users are who they claim to be (authentication), they are
        authorized to access certain resources (authorization), and all user
        actions are tracked and logged (accounting). This approach helps to
        provide secure, role-based access to systems, preventing unauthorized
        activities and keeping a detailed audit trail of usage. In modern
        applications, AAA is commonly implemented using authentication systems
        such as OAuth or JWT for user identification, access control lists
        (ACLs) for authorization, and logging mechanisms for monitoring
        activity. The integration of these elements forms the backbone of
        secure access to critical resources, both in corporate environments and
        in the cloud.
      </p>

      <div className="image-grid">
        <img src={myImage1} alt="AAA 1" className="grid-image" />
        <img src={myImage2} alt="AAA 2" className="grid-image" />
        <img src={myImage3} alt="AAA 3" className="grid-image" />
        
      </div>
    </div>
  );
};

export default User;
