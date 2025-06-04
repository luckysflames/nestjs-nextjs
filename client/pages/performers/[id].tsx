import { useRouter } from "next/router";
import React from "react";

const TrackPage: React.FC = () => {
    const router = useRouter();
    const { id } = router.query;
    
    return (
        <div>{id} page</div>
    );
};

export default TrackPage;
