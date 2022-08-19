import React, {Component} from 'react'
import BoxHeader from '../components/BoxHeader';
import IssueCard from '../components/IssueCard';

class App extends Component {
    render() {
        return (
            <>
                <BoxHeader />
                <div className="main-container p-3">
                    <IssueCard id={123} createdAt={new Date()} title="Group Chat - Unable to create group chats" isMerged/>
                </div>
            </>
        );
    };
}

export default App;
