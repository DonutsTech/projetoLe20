'use client'
import React from 'react';
import Style from './Background.module.scss';

const Background = () => {

  return (
    <>
      <div className={Style.overlay} />
      <video playsInline autoPlay muted loop className={Style.video}>
        <source src="/assets/video/bg.mp4" type="video/mp4" />
      </video>
    </>
  )
};

export default Background;
