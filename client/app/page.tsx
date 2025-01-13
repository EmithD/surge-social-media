"use client";

import React from 'react'
import useIfAuthRedirect from './hooks/useIfAuthRedirect';

const Home = () => {

  useIfAuthRedirect('/');

  return (
    <div>Home</div>
  )
}

export default Home
