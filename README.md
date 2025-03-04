# Advertisement Payer

A modern advertisement slider application built with Next.js, featuring smooth transitions, auto-scrolling, and interactive controls.

## Features

- **Responsive Ad Slider**: Displays property advertisements with images and details
- **Smooth Image Transitions**: Elegant transitions between images with directional animations
- **Auto-Scroll Functionality**: Automatic scrolling with play/pause controls
- **Bidirectional Scrolling**: Support for both up and down scrolling in loop mode
- **Direction Control**: Toggle between upward and downward scrolling directions
- **Touch Support**: Swipe gestures for mobile devices
- **Keyboard Navigation**: Arrow key support for desktop users

## Technologies Used

- **Next.js**: React framework for server-rendered applications
- **TypeScript**: Type-safe JavaScript
- **GSAP**: Animation library for smooth scrolling effects
- **Tailwind CSS**: Utility-first CSS framework for styling

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/advertisementpayer.git
cd advertisementpayer
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `/app`: Next.js app directory containing pages
- `/components`: Reusable React components
  - `ad-slider.tsx`: Main advertisement slider component
  - `ad-video-player.tsx`: Alternative video-based ad player
- `/public`: Static assets
- `/styles`: Global styles

## Usage

The ad slider can be customized by modifying the ad data in `app/page.tsx`. Each ad object includes:

```typescript
{
  id: number,
  title: string,
  location: string,
  images: string[],
  description: string,
  price: string,
  features: string[],
}
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Images from Unsplash
- Icons from Lucide React
