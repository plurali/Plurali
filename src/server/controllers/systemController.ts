import { controller } from "../plugins/controllers";
import { data } from "../status";
import { withSystemContext } from "../contexts/systemContext";

export default controller(async (server) => {
    server.get("/", async (req, res) =>
        withSystemContext(
            { req, res }, ({ system }) => res.send(data({ system }))
        )
    )

    server.get("/members", async (req, res) =>
        withSystemContext(
            { req, res }, async ({ members }) => res.send(data({ members: await members }))
        )
    )
}, "/system");