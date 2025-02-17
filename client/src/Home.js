import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

const Home = () => {
    return (
        <div>
            <h1>Welcome to the Graduation Reminder App</h1>
            <p>Please sign up or log in.</p>
            <nav>
                <Link to="/signup">Sign Up</Link> | <Link to="/login">Login</Link>
            </nav>
        </div>
    );

}
export default Home;