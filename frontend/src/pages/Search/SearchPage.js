import React from 'react';
import SearchHeader from '../../components/Search/SearchHeader';
import ProjectFilterPanel from '../../components/Search/ProjectFilterPanel';
import ProjectList from '../../components/Search/ProjectList';
import './SearchPage.css';

const SearchPage = () => {
    return (
        <div className="search-page">
            <SearchHeader />
            <div className="content">
                <ProjectFilterPanel />
                <ProjectList />
            </div>
        </div>
    );
};

export default SearchPage;
