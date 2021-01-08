const config = require("./config.json");
const axios = require("axios");
const Hetzner = require("hetzner-dns");
const Client = new Hetzner(config.hetznerApi);

const main = async () => {
  try {
    let zone_id = "";
    let record_id = "";
    const result = await axios.get(config.myipbot);
    const myIP = result.data;

    const zones = await Client.Zones.GetAll(1, 10, config.domain);
    zones["zones"].find((z) => {
      z.name === config.domain;
      zone_id = z.id;
    });

    const records = await Client.Records.GetAll(1, 10, zone_id);
    records["records"].find((r) => {
      r.name === config.host;
      record_id = r.id;
    });

    const data = await Client.Records.Update(
      record_id,
      zone_id,
      config.host,
      "A",
      myIP,
      config.ttl
    );

    const record = await Client.Records.Get(record_id);
    console.log(record);
  } catch (error) {
    console.log(error);
  }
};
main();
