import React from 'react';
import './Footer.css';
import { Button } from './Button';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <div className='footer-container'>
      <section className='footer-subscription'>
        <p className='footer-subscription-heading'>
          Join the Memories with Mike newsletter to receive updates on our adventures!
        </p>
        <p className='footer-subscription-text'>
          You can unsubscribe at any time.
        </p>
        <div className='input-areas'>
          <form>
            <input
              className='footer-input'
              name='email'
              type='email'
              placeholder='Your Email'
            />
            <Button buttonStyle='btn--outline'>Subscribe</Button>
          </form>
        </div>
      </section>
      <div className='footer-links'>
        <div className='footer-link-wrapper'>
          <div className='footer-link-items'>
            <h2>About Us</h2>
            <Link to='/sign-up'>How it works</Link>
            <Link to='/'>Testimonials</Link>
            <Link to='/'>Investors</Link>
          </div>
          <div className='footer-link-items'>
            <h2>Contact Us</h2>
            <Link to='/'>Contact</Link>
            <Link to='/'>Support</Link>
            <Link to='/'>Destinations</Link>
            <Link to='/'>Sponsorships</Link>
          </div>
        </div>
        <div className='footer-link-wrapper'>
          <div className='footer-link-items'>
            <h2>Social Media</h2>
            <a href='https://www.instagram.com/michael.kennedy.585/'>Instagram</a>
            <a href='https://www.facebook.com/memorieswithmike/'>Facebook</a>
            <a href='https://www.youtube.com/channel/UC279JaUBPz5mSDB4uAOde_Q'>Youtube</a>
            <a href='https://twitter.com/Cass10169'>Twitter</a>
            <a href='https://www.linkedin.com/in/michael-kennedy-27112331/'>LinkedIn</a>
          </div>
        </div>
      </div>
      <section className='social-media'>
        <div className='social-media-wrap'>
          <div className='footer-logo'>
            <Link to='/' className='social-logo'>
              Memories with Mike
              <i className='fab fa-typo3' />
            </Link>
          </div>
          <small className='website-rights'>MwM © 2022</small>
          <div className='social-icons'>
            <a href='https://www.facebook.com/memorieswithmike/'
              className='social-icon-link facebook'
              aria-label='Facebook'
            >
              <i className='fab fa-facebook-f' />
            </a>
            <a href='https://www.instagram.com/michael.kennedy.585/'
              className='social-icon-link instagram'
              aria-label='Instagram'
            >
              <i className='fab fa-instagram' />
            </a>
            <a href='https://www.youtube.com/channel/UC279JaUBPz5mSDB4uAOde_Q'
              className='social-icon-link youtube'
              aria-label='Youtube'
            >
              <i className='fab fa-youtube' />
            </a>
            <a href='https://twitter.com/Cass10169'
              className='social-icon-link twitter'
              aria-label='Twitter'
            >
              <i className='fab fa-twitter' />
            </a>
            <a href='https://www.linkedin.com/in/michael-kennedy-27112331/'
              className='social-icon-link twitter'
              aria-label='LinkedIn'
            >
              <i className='fab fa-linkedin' />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Footer;
