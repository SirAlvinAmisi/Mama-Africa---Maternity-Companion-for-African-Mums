import Notification from "../components/Notification";
import Chat from "../components/chat/ChatList";
import CommunityDetail  from "./CommunityDetail";   
import PostForm from "../components/posts/PostForm";    
import PostList from "../components/posts/PostList";
import PostCard from "../components/posts/PostCard";  


function ViewPage() {

    return (
        <div>
        <h1>This is the view page for new files before configuration.</h1>
        {/* <Notification />
        <Chat /> */}
        <CommunityDetail />
        <PostForm />
        {/* <PostList /> */}
        {/* <PostCard />  */}
                </div>
    );
}
export default ViewPage;