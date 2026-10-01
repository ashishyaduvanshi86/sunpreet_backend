// Static testimonials data — served entirely from the frontend so videos
// remain playable even if the backend is sleeping (Render free tier cold start).
// To add a new video testimonial: drop the .jpg thumbnail in /public/thumbnails/
// and add an entry here.
export const testimonials = [
  {
    id: 'test-1',
    name: 'Alaya F',
    role: 'Student - 8 months',
    content:
      "Sunpreet's coaching transformed not just my flexibility but my entire approach to movement. His methodical approach gave me the splits I thought were impossible.",
    video_url:
      'https://customer-assets.emergentagent.com/job_075373c5-0904-4300-a194-369619411e36/artifacts/3wogulys_Alaya%20Testimonial%20Video.mp4',
    image_url: '/thumbnails/alaya.jpg',
  },
  {
    id: 'test-2',
    name: 'Shradha',
    role: 'Student - 6 months',
    content:
      "What sets Sunpreet apart is his holistic approach. It's not just about achieving poses—it's about understanding your body and moving with intention.",
    video_url:
      'https://customer-assets.emergentagent.com/job_075373c5-0904-4300-a194-369619411e36/artifacts/qhbvhlk1_Shradha%20Video.mp4',
    image_url: '/thumbnails/shradha.jpg',
  },
  {
    id: 'test-3',
    name: 'Sakhshi',
    role: 'Student - 1 year',
    content:
      'The patience and attention to detail in every session is remarkable. I went from zero handstand experience to holding a freestanding handstand in 10 months.',
    video_url:
      'https://customer-assets.emergentagent.com/job_075373c5-0904-4300-a194-369619411e36/artifacts/yzh3yfxg_Sakshi%20Video%20.mp4',
    image_url: '/thumbnails/sakshi.jpg',
  },
];
