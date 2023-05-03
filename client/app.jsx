const helper = require('./helper.js');
const React = require('react');
const ReactDOM = require('react-dom');

const handlePost = (e) => {
    e.preventDefault();
    helper.hideError();

    const name = e.target.querySelector('#postName').value;


    
    if(!name){
        helper.handleError('All fields are required!');
        return false;
    }

    helper.sendPost(e.target.action, {name,}, loadPostsFromServer);

    return false;
}

const handleChange = (e) => {
    e.preventDefault();
    helper.hideError();

    const pass = e.target.querySelector('#pass').value;
    const pass2 = e.target.querySelector('#pass2').value;
    
    if(!pass || !pass2){
        helper.handleError('All fields are required!');
        return false;
    }

    if(pass !== pass2){
        helper.handleError('Passwords do not match!')
        return false;
    }
    helper.sendPost(e.target.action, {pass, pass2});

    return false;
}

const PostForm = (props) => {
    return (
        <form id="postForm"
            onSubmit={handlePost}
            name="postMaker"
            action="/maker"
            method="POST"
            className="postForm"
        >
            <input id="postName" type="text" name="name" placeholder="type post here" />
            <input className="makeNewPost" type="submit" value="Make Post" />
        </form>
    );
};


const signUpForPremium = (e) => {
    e.preventDefault();
    if (e.target.querySelector("#cardNumber").value == '') {
        handleError("All fields are required");
        return false;
    }
    
    const cardData = e.target.querySelector("#cardNumber").value

    helper.sendPost(e.target.action, {cardData});

    return false;
}

const ProfilePage = (props) => {
        return (
            <div className="profile">
                <img src={`/assets/img/missing.png`} alt="post face" className="profileFace" />
                <h3 classname="postPoster">Your Profile</h3>
            </div>
        );
}

const PostList = (props) => {
    if(props.posts.length === 0){
        return (
            <div className="postList">
                <h3 classname="emptyPage">No Posts Yet!</h3>
            </div>
        );
    }

    const postNodes = props.posts.map(post => {
        return (
            <div key={post._id} className="post">
                <img src={`/assets/img/${post.image}.png`} alt="post face" className="postImg" />
                <h3 classname="postPoster">{post.creator}</h3>
                <h3 classname="postName">{post.name}</h3>
            </div>
        );
    });

    return (
        <div className="postList">
            {postNodes}
        </div>
    );
}

const PasswordForm = (props) => {
    return (
        <form id="passwordForm"
            onSubmit={handleChange}
            name="passwordForm"
            action="/newpass"
            method="POST"
            className="mainForm"
        >
            <label htmlFor="username">Username: </label>
            <input id="user" type="text" name="username" placeholder="username" />
            <label htmlFor="pass">New Password: </label>
            <input id="pass" type="password" name="pass" placeholder="password" />
            <label htmlFor="pass">New Password: </label>
            <input id="pass2" type="password" name="pass2" placeholder="retype password" />
            <input type="hidden" name="_csrf" value={props.csrf} />
            <input className="inputSubmit" type="submit" value="Reset" />
        </form>
    );
};

const DocuPage = (props) => {
    return (
        <div className="premiumSignup">
            <h1 className="heading">Documentation</h1>
            <h3>For this project, I created a service that works similar to Twitter</h3>
            <h1 className="heading">Models</h1>
            <h3>This project primarily uses 2 different models, one for an account and one for a post</h3>
            <h3>For an account, it uses a username, password, credit card numbers, and a profile picture, which is randomly selected</h3>
            <h3>The password and credit card numbers are stored using a hashing alorithm</h3>
            <h3>The posts store the username and profile picture from the account as well as the text that the user wishes to post.</h3>
            <h3>It uses these in order to create a post the uses the username and profile picture as the poster information, then uses the post to show the post as it it were like a tweet</h3>
            <h1 className="heading">Some further info</h1>
            <h3>The purpose of this program is to be used as a sort of twitter replacement, as it allows other users to see your posts and you to see theres</h3>
            <h3>if I were to complete it further, I would like to add custom profile pictures and add images/videos to posts, as well as make it so the ads appear properly</h3>
            <h3>if given another week this would likely have been finished</h3>
            <h3>overall, I expaneded my understanding of react and how it works</h3>
            <h3>this project uses react in order to load new webpages while logged in as well as swap between login and signup without needing to load a new page</h3>
            <h3>the elements that are used consist of ones for a new post box, each post, the list of posts, a profile page, the new password, premium and documentation pages, as well as login and signup</h3>
            <h3>most things went right as I was able to make this application for the most part</h3>
            <h3>However, I was not able to get custom profile images and images in posts added properly</h3>
            <h3>the data being stored in mongoDB is the data for each post and account, if this was further expanded, a new section in the posts would be added for images</h3>
            <h3>personally, I do not feel that I went above and beyond, as I have a lot going on around the same time and I want to get my projects done so that I can graduate as this is one of the last classes i need</h3>
            <h1 className="heading">reused code</h1>
            <h3>Some of this code is reworked from the domomaker homework as it was repurposed into this project</h3>
            <h1 className="heading">Endpoints</h1>
            <h3>
            URL: /getPosts
            Supported Methods: GET
            Middleware: Requires Secure, Requires Login
            Query Params: 
            Description: Retrieves posts made by every user.
            Return Type(s): JSON
            </h3>
            <h3>
            URL: /myPosts
            Supported Methods: GET
            Middleware: Requires Login
            Query Params: 
            Description: Retrieves posts made by the user logged in.
            Return Type(s): JSON
            </h3>
            <h3>
            URL: /login
            Supported Methods: GET, POST
            Middleware: Requires Secure, Requires Login
            Query Params: username (the username for the account), pass (the pre-hash password)
            Description: logs the user in.
            Return Type(s): JSON
            </h3>
            <h3>
            URL: /signup
            Supported Methods: POST
            Middleware: Requires Secure, Requires Logout
            Query Params: username (the username for the account), pass (the pre-hash new password), pass2 (the pre-hash new password to be confirmed)
            Description: creates the new account
            Return Type(s): JSON
            </h3>
            <h3>
            URL: /logout
            Supported Methods: GET
            Middleware: Requires Secure, Requires Login
            Query Params: none
            Description: logs the user out
            Return Type(s): none
            </h3>
            <h3>
            URL: /app
            Supported Methods: GET, POST
            Middleware:  Requires Login
            Query Params: none
            Description: allows the user to see all posts and make posts of their own
            Return Type(s): JSON
            </h3>
            <h3>
            URL: /newpass
            Supported Methods: POST
            Middleware:  Requires Login
            Query Params: username (the username for the account), pass (the pre-hash new password), pass2 (the pre-hash new password to be confirmed)
            Description: changes the user's password
            Return Type(s): JSON
            </h3>
            <h3>
            URL: /signupPremium
            Supported Methods: GET, HEAD
            Middleware: Requires Secure, Requires Login
            Query Params: username (the username for the account), cardNumbers(the card number to be used for purchase)
            Description: purchases premium for the user
            Return Type(s): JSON
            </h3>
            <h3></h3>
        </div>
    );
};



const PremiumPage = (props) => {
    return (
        <div className="premiumSignup">
            <h1 className="heading">Sign Up for Premium</h1>
            <h3>Upgrade to premium for an ad-free experience! All for 5 dollars a month!</h3>
            <form
                id="premiumSignupForm"
                onSubmit={signUpForPremium}
                name="premiumSignupForm"
                action="/signupPremium"
                method="POST"
                className="premiumSignup"
            >
                <label htmlFor="cardNumber">Credit Card Number: </label>
                <input id="cardNumber" type="text" name="cardNumber" placeholder="0000000000000000" />
                <input className="inputSubmit" type="submit" value="Sign Up" />
            </form>
        </div>
    );
};

const loadPostsFromServer = async () => {
    const response = await fetch('/getPosts');
    const data = await response.json();
    ReactDOM.render(
        <PostList posts={data.posts.reverse().slice(0,24)} />,
        document.getElementById('content')
    )
}

const loadMyPostsFromServer = async () => {
    const response = await fetch('/myPosts');
    const data = await response.json();
    console.log(data);
    ReactDOM.render(
        <PostList posts={data.posts.reverse()} />,
        document.getElementById('content')
    )
    ReactDOM.render(
        <ProfilePage posts={data.posts}/>,
        document.getElementById('newPost')
    )
}

const init = () => {
    ReactDOM.render(
        <PostForm />,
        document.getElementById('newPost')
    );

    ReactDOM.render(
        <PostList posts={[]} />,
        document.getElementById('content')
    );
    
    loadPostsFromServer();

    const myPostsButton = document.getElementById('myPostsButton');

    myPostsButton.addEventListener('click', (e) => {
        loadMyPostsFromServer();
    });

    const premiumButton = document.getElementById('premiumButton');

    premiumButton.addEventListener('click', (e) => {
        ReactDOM.render(
            <nothing />,
            document.getElementById('newPost')
        );
        ReactDOM.render(
            <PremiumPage />,
            document.getElementById('content')
        );
    })

    const newPassButton = document.getElementById('newPassButton');

    newPassButton.addEventListener('click', (e) => {
        e.preventDefault();
        ReactDOM.render(<PasswordForm />,
            document.getElementById('content'));
        ReactDOM.render(<nothing />,
            document.getElementById('newPost'));
            return false;
    });

    const docuButton = document.getElementById('docuButton');

    docuButton.addEventListener('click', (e) => {
        e.preventDefault();
        ReactDOM.render(<DocuPage />,
            document.getElementById('content'));
        ReactDOM.render(<nothing />,
            document.getElementById('newPost'));
            return false;
    });

};

window.onload = init;