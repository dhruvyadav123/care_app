import React, { Fragment } from "react";
import { Container, Row } from "reactstrap";
import { Breadcrumbs } from "../../../../AbstractElements";
import UserProfile from "../../../Bonus-Ui/Tour/UserProfile";
import UserDetails from "./UserDetail";
import UserDetails2 from "./UserDetail2";
import UserDetails3 from "./UserDetails3";
import UserDetails4 from "./UserDetail4";
import { useDispatch, useSelector } from "react-redux";

const UsersProfileContain = () => {

  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth);

  return (
    <Fragment>
      <Breadcrumbs mainTitle="User Profile" parent="Users" title="User Profile" />
      <Container fluid={true}>
        <div className="user-profile">
          <Row>
            <UserProfile data={user}/>
            {/* <UserDetails />
            <UserDetails2 />
            <UserDetails3 />
            <UserDetails4 /> */}
          </Row>
        </div>
      </Container>
    </Fragment>
  );
};
export default UsersProfileContain;
