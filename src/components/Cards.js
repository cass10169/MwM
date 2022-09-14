import React from 'react';
import './Cards.css';
import CardItem from './CardItem';

function Cards() {
  return (
    <div className='cards'>
      <h1>Adventure awaits! what memories will you create?</h1>
      <h2>Each image may be purchased as a canvas print, metal print, and more! Contact us to see how you can create your own Memories with Mike!</h2>
      <div className='cards__container'>
        <div className='cards__wrapper'>
          <ul className='cards__items'>
            <CardItem
              src='images/SanJuan-1.jpg'
              text='Explore the hidden waterfall deep inside the San Juan Mountain Range'
              label='Adventure'
              path='/services'
            />
            <CardItem
              src='images/SanJuan-2.jpg'
              text='Go on the hunt through the wildness to find exotic mushrooms'
              label='Mystery'
              path='/services'
            />
          </ul>
          <ul className='cards__items'>
            <CardItem
              src='images/SanJuan-3.jpg'
              text='Visit the crystal blue waters that flow down the mountain streams'
              label='Adventure'
              path='/services'
            />
            <CardItem
              src='images/SanJuan-Pano-1.jpg'
              text='Ride through 4x4 trails to reach the tops of mountain peaks!'
              label='Adrenaline'
              path='/sign-up'
            />
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Cards;
