import React, { useMemo, useState } from "react";
import "./SearchBar.css";
import { FaSearch, FaTimesCircle } from "react-icons/fa";
import { useSelector } from "react-redux";
import { getAllProfilesData } from "../UserSlice/UserSlice";
import ProfileTag from "../ProfileTag/ProfileTag";

const SearchBar = () => {
  const [searchInput, setSearchInput] = useState("");
  const { userProfiles } = useSelector(getAllProfilesData);
  const filteredInputs = useMemo(
    () =>
      searchInput.trim() === ""
        ? userProfiles
        : userProfiles?.filter((item) =>
            item?.displayName?.toLowerCase().includes(searchInput.toLowerCase())
          ),
    [searchInput, userProfiles]
  );

  const inputHandler = (event) => setSearchInput(event.target.value);

  const clearInput = () => setSearchInput("");

  return (
    <label className="search-bar">
      <span className="search-bar-btn">
        <FaSearch />
      </span>
      <input
        className="search-bar-input"
        type="text"
        placeholder="Type to search user"
        name="search"
        autoComplete="off"
        value={searchInput}
        onChange={inputHandler}
      />
      <span
        className={`search-bar-btn ${
          searchInput.length > 0 ? "" : "hide-search-bar-btn"
        }`}
        onClick={clearInput}
      >
        <FaTimesCircle />
      </span>
      {searchInput.length > 0 && (
        <div className="search-result">
          {searchInput.trim() !== "" && filteredInputs.length === 0 && (
            <div className="text-grey-md text-md">User not found</div>
          )}
          {filteredInputs.length > 0 &&
            filteredInputs.map((profile, idx) => (
              <ProfileTag
                key={`search-list-profile-tag-${profile.uid}`}
                displayName={profile.displayName}
                photoURL={profile.photoURL}
                uid={profile.uid}
                search={true}
                onClick={clearInput}
              />
            ))}
        </div>
      )}
    </label>
  );
};

export default SearchBar;
