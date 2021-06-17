const mongoose = require("mongoose");
const Campground = require("../models/campground");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
mongoose.connect("mongodb://localhost:27017/yelp-camp", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  //removes everything from the db
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      author: "60b6c64ad5258d55a0966a6a",
      title: `${sample(descriptors)} ${sample(places)}`,
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      geometry: { type: "Point", coordinates: [-6.37, 39.47] },
      images: [
        {
          url: "https://res.cloudinary.com/dh2pfg3zv/image/upload/v1622917560/CampReview/sna82y5mnydjssqwffnp.jpg",
          filename: "camping1",
        },
        {
          url: "https://res.cloudinary.com/dh2pfg3zv/image/upload/v1622917561/CampReview/pchmrfcdjc5wgvthxw2o.jpg",
          filename: "camping2",
        },
        //FROM HERE
        {
          url: "https://res.cloudinary.com/dh2pfg3zv/image/upload/v1622918166/CampReview/zisrsrcgtlyyaa9ka9np.jpg",
          filename: "camping3",
        },
        {
          url: "https://res.cloudinary.com/dh2pfg3zv/image/upload/v1622918167/CampReview/sz4wce41xjttxxhhyzk0.jpg",
          filename: "camping4",
        },
        {
          url: "https://res.cloudinary.com/dh2pfg3zv/image/upload/v1622918167/CampReview/gvkflqjogastgrzawcen.jpg",
          filename: "camping5",
        },
        {
          url: "https://res.cloudinary.com/dh2pfg3zv/image/upload/v1622918168/CampReview/gwacfhh4k4v6qv2mfeug.jpg",
          filename: "camping6",
        },
        {
          url: "https://res.cloudinary.com/dh2pfg3zv/image/upload/v1622918168/CampReview/lrvabgdo6t4yrxs2xbga.jpg",
          filename: "camping7",
        },
      ],
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis nemo excepturi qui maiores corporis vero recusandae esse eligendi voluptas distinctio. Nihil nam ipsa consectetur at quod saepe dicta delectus ratione.",
      price,
    });
    await camp.save();
  }
};
seedDB().then(() => {
  mongoose.connection.close();
});
