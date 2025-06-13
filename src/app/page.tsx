'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import { ChatWindow } from '@/components/ChatWindow';
import { MessageInput } from '@/components/MessageInput';
import { ActionButtons } from '@/components/ActionButtons';
import { ResultsScreen } from '@/components/ResultsScreen';
import { Box, Container, CircularProgress } from '@mui/material';

// Define the shape of our data
type Message = { sender: 'bot' | 'user'; text: string };
type Answer = { id: string; text: string; risk_score: number; next_question_id: string | null };
type Action = { id: string; text: string };
type Question = { id: string; text: string; is_critical: boolean };

// Initialize the Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [actions, setActions] = useState<Action[]>([]);
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [currentQuestionAnswers, setCurrentQuestionAnswers] = useState<Answer[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [riskScore, setRiskScore] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [assessmentComplete, setAssessmentComplete] = useState(false);
  const [finalPremium, setFinalPremium] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);

  // This hook now fetches ONLY the questions at the start
  useEffect(() => {
    const fetchAllQuestions = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('questions')
        .select(`*`) // Simplified to fetch only questions
        .eq('industry', 'cybersecurity')
        .order('order', { ascending: true });

      if (error || !data || data.length === 0) {
        console.error('Error fetching questions:', error);
        setMessages([{ sender: 'bot', text: 'Sorry, I could not load the assessment questions.' }]);
      } else {
        setAllQuestions(data);
        setCurrentQuestionIndex(0); // Start at the first question
        setMessages([ { sender: 'bot', text: "Welcome! Let's start with a few questions." } ]);
      }
      setIsLoading(false);
    };

    fetchAllQuestions();
  }, []);

  // NEW: This hook fetches the answers for the CURRENT question whenever it changes
  useEffect(() => {
    const fetchAnswersForCurrentQuestion = async () => {
      if (allQuestions.length === 0) return;

      setIsLoading(true);
      const currentQuestion = allQuestions[currentQuestionIndex];
      const { data, error } = await supabase
        .from('answers')
        .select('*')
        .eq('question_id', currentQuestion.id);

      if (error) {
        console.error('Error fetching answers:', error);
        setMessages(prev => [...prev, { sender: 'bot', text: 'Sorry, there was an error loading the answers.' }]);
      } else {
        // Display the question text and set the actions/answers
        setMessages(prev => [...prev, { sender: 'bot', text: currentQuestion.text }]);
        setCurrentQuestionAnswers(data || []);
        setActions(data || []);
      }
      setIsLoading(false);
    };

    // Only run if we have questions and haven't completed the assessment
    if (allQuestions.length > 0 && !assessmentComplete) {
      fetchAnswersForCurrentQuestion();
    }
  }, [currentQuestionIndex, allQuestions, assessmentComplete]);
  
  // This hook auto-focuses the text input
  useEffect(() => {
    if (!isLoading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLoading, messages]);


  const handleActionClick = async (action: Action) => {
    if (isLoading) return;

    const userMessage: Message = { sender: 'user', text: action.text };
    const chosenAnswer = currentQuestionAnswers.find(a => a.id === action.id);
    const newScore = riskScore + (chosenAnswer?.risk_score || 0);
    
    setRiskScore(newScore);
    setMessages(prev => [...prev, userMessage]);
    setActions([]);
    
    // Logic to find the next question (branched or linear)
    let nextIndex = -1;
    if (chosenAnswer && chosenAnswer.next_question_id) {
        nextIndex = allQuestions.findIndex(q => q.id === chosenAnswer.next_question_id);
    } else {
        const linearNextIndex = currentQuestionIndex + 1;
        if (linearNextIndex < allQuestions.length) {
            nextIndex = linearNextIndex;
        }
    }

    if (nextIndex !== -1) {
      setCurrentQuestionIndex(nextIndex);
    } else {
      const estimatedPrice = newScore * 125;
      setFinalPremium(estimatedPrice);
      setMessages(prev => [...prev, { sender: 'bot', text: `Assessment complete! Thank you.` }]);
      setAssessmentComplete(true);
    }
  };
  
  // ... (handleFreeFormSubmit and handleProceed functions remain the same) ...
  const handleFreeFormSubmit = async (text: string) => {
    if (isLoading) return;

    const userMessage: Message = { sender: 'user', text };
    setMessages(prev => [...prev, userMessage]);
    const currentActions = currentQuestionAnswers;
    setActions([]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/nlp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userText: text, choices: currentActions }),
      });

      if (!response.ok) throw new Error('NLP service failed.');

      const { matchedAnswerId } = await response.json();
      const matchedAction = currentActions.find(a => a.id === matchedAnswerId);

      if (matchedAction) {
        handleActionClick(matchedAction as Action);
      } else {
        setMessages(prev => [...prev, { sender: 'bot', text: "Sorry, I didn't quite understand. Please select one of the options." }]);
        setActions(currentActions);
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { sender: 'bot', text: 'There was an error processing your request. Please try again.' }]);
      setIsLoading(false);
    }
  };

  const handleProceed = () => {
    alert('This would proceed to the lead capture form logic.');
  };

  if (assessmentComplete) {
    return <ResultsScreen score={riskScore} estimatedPremium={finalPremium} onProceed={handleProceed} />;
  }

  if (isLoading && messages.length === 0) {
    return <CircularProgress sx={{ display: 'block', margin: '100px auto' }} />;
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4, display: 'flex', flexDirection: 'column', height: '80vh' }}>
        <ChatWindow messages={messages} />
        <Box>
          {!isLoading && <ActionButtons actions={actions} onActionClick={handleActionClick} />}
          <MessageInput ref={inputRef} disabled={isLoading || actions.length === 0} onSubmit={handleFreeFormSubmit} />
        </Box>
      </Box>
    </Container>
  );
}