import React, {Component} from 'react'
import Header from '../components/Header';
import IssueCard from '../components/IssueCard';

class App extends Component {
    render() {
        return (
            <>
                <Header />
                <div className="main-container p-3">
                    <IssueCard id={123} createdAt={new Date()} title="Group Chat - Unable to create group chats" isMerged/>
                </div>
            </>
        );
    };
}

export default App;
