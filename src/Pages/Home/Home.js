import PostListing from "../../Components/PostListing/PostListing";
import ProfileListing from "../../Components/ProfileListing/ProfileListing";
import "./Home.css";

const Home = () => {
  return (
    <div className="main-section home-section">
      <PostListing />
      <ProfileListing />
    </div>
  );
};

export default Home;
