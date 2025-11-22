import React, { useState } from 'react';
import { Send, Sparkles, Copy, Check } from 'lucide-react';
import { generateLinkedInPost } from '../services/geminiService';

interface PostCreatorProps {
  audience: 'student' | 'professional';
}

const PostCreator: React.FC<PostCreatorProps> = ({ audience }) => {
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState<'professional' | 'casual' | 'excited'>('professional');
  const [generatedPost, setGeneratedPost] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!topic) return;
    setIsLoading(true);
    setCopied(false);
    const post = await generateLinkedInPost(topic, audience, tone);
    setGeneratedPost(post);
    setIsLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPost);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 h-full flex flex-col transition-colors duration-300">
      <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
        <span className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
          <Send className="w-5 h-5" />
        </span>
        LinkedIn Post Creator
      </h2>

      <div className="space-y-4 flex-grow">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            What's on your mind?
          </label>
          <textarea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder={audience === 'student' ? "E.g., Just finished my Python project..." : "E.g., Networking strategies for Q4..."}
            className="w-full p-3 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none h-24 resize-none placeholder-slate-400 dark:placeholder-slate-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Tone</label>
          <div className="flex gap-2">
            {(['professional', 'casual', 'excited'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTone(t)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium capitalize transition-colors ${
                  tone === t 
                    ? 'bg-brand-600 text-white' 
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={isLoading || !topic}
          className="w-full bg-brand-600 hover:bg-brand-700 text-white py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? <Sparkles className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          {isLoading ? 'Generating...' : 'Generate Post'}
        </button>

        {generatedPost && (
          <div className="mt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Preview</h3>
              <button 
                onClick={handleCopy}
                className="text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm whitespace-pre-wrap font-sans leading-relaxed">
              {generatedPost}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostCreator;