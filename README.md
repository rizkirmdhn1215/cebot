echo "# Cebot

Cebot is a simple chatbot built using Next.js and Supabase as the backend.

## Features

- **Next.js** for the frontend
- **Supabase** for the backend
- Basic chatbot functionality

## Installation

1. Clone the repository:
   \`\`\`sh
   git clone https://github.com/rizkirmdhn1215/cebot.git
   cd cebot
   \`\`\`

2. Install dependencies:
   \`\`\`sh
   npm install
   \`\`\`

3. Set up Supabase:
   - Create a project on [Supabase](https://supabase.io).
   - Obtain your Supabase URL and API Key.
   - Create a \`.env.local\` file in the root directory of the project and add the following environment variables:
     \`\`\`env
     NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
     \`\`\`

4. Run the development server:
   \`\`\`sh
   npm run dev
   \`\`\`

   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Usage

- Interact with the chatbot through the web interface.
- Customize the bot's responses and behavior through the Supabase backend.

## Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

## License

This project is licensed under the MIT License." > README.md

git add README.md
git commit -m "Add README.md"
git push origin main
