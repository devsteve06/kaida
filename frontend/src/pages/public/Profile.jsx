import { useAuth } from "../../context/Auth_Context";

import React from 'react'

function Profile() {

    const {user, login, logout}  =useAuth();

        if (loading) {
                return(
                    <div>
                        <p>Loading Profile...</p>
                    </div>
                )
        }
        if (!user) {
            return (
                <div>
                    <h2> You Are Not Authenticated.</h2>
                </div>
                        )
        }
    
  
        return (
            <div>
                <div>
                    <h2>My Profile.</h2>

                    <button onClick={logout}>LogOut</button>
                </div>

                <div>
                    <div></div>
                    <p>Name : </p>
                    <p>{user.name}</p>
                </div>

                <div>
                    <div></div>
                    <p>Email: </p>
                    <p>{user.email}</p>
                </div>

                <div>
                    <div></div>
                    <p>role : </p>
                    <p>{user.role}</p>
                </div>

                <div>
                    <div></div>
                    <p>Member Since : </p>
                    <p>{new  Date(user.created_at).toLocaleDateString()}</p>
                </div>

            </div>
        );
}

export default Profile;