// delete image from cloudinary

const publicIdWithoutExtentionFromUrl = async (imageUrl) => {
  const pathSegments = imageUrl.split("/");

  const lastSegment = pathSegments[pathSegments.length - 1];

  const valueWithoutExtension = lastSegment.replace(".jpg", "");
  return valueWithoutExtension;
};
