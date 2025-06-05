import { NextPage } from "next";
import PerformerList from "../../components/PerformerItems/PerformerList";

const Index: NextPage = () => {
    return (
        <>
            <h1>Performers page</h1>
            <PerformerList />
        </>
    );
};

export default Index;
