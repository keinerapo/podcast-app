import { useParams } from 'react-router-dom';

export function PodcastDetailPage() {
  const { podcastId } = useParams<{ podcastId: string }>();

  return (
    <div className="container">
      <div>
        <h1>Podcast Detail - ID: {podcastId}</h1>
      </div>
    </div>
  );
}
