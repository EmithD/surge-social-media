"use client";

import React from 'react'
import useIfAuthRedirect from './hooks/useIfAuthRedirect';

const page = () => {

  useIfAuthRedirect('/');

  return (
    <div>page</div>
  )
}

export default page
