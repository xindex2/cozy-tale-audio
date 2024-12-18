import { useParams } from "react-router-dom";
import StoryView from "./StoryView";

export default function Story() {
  const { id } = useParams<{ id: string }>();
  
  if (!id) {
    return <div>Story ID not found</div>;
  }
  
  return <StoryView id={id} />;
}