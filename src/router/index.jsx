import React from 'react';
import Layout from "../layout";
import Member from "../pages/member";
import Technology from "../pages/technology";
export default [
    {
        path: "/",
        element: <Layout />,
        children: [

            {
                path: "/",
                element: <Technology />
            },
            {
                path: "/Technology",
                element: <Technology />
            },
            {
                path: "/member",
                element: <Member />,
            },
        ]
    }
];