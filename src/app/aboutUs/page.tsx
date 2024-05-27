import classes from './page.module.css';

export default function AboutUs(){
    return (
        <>
          <header className={classes.header}>
            <h1>
              About us
            </h1>
            <p>TMDB with Next.js!</p>
          </header>
          <main className={classes.main}>
            <h2>Why TBDM</h2>
    
            <ul className={classes.perks}>
              <li>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              </li>
              <li>
                <p>Integer laoreet augue at lacus pretium, sit amet rhoncus arcu facilisis.</p>
              </li>
              <li>
                <p>Integer in massa aliquam, efficitur nisi viverra, venenatis metus.</p>
              </li>
            </ul>
          </main>
        </>
      );
}