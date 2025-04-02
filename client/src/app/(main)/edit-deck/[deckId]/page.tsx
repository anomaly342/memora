'use client';
import * as React from 'react';
import { useState } from 'react';
// import Navbar2 from '@/components/Navbar2';
import Button from '@mui/material/Button';
import TitleIcon from '@mui/icons-material/Title';
import PhotoIcon from '@mui/icons-material/Photo';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import KeyboardVoiceIcon from '@mui/icons-material/KeyboardVoice';
import Box from '@mui/material/Box';
import AddIcon from '@mui/icons-material/Add';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Image from 'next/image';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import RemoveIcon from '@mui/icons-material/Remove';
import { ThemeProvider, CssBaseline } from '@mui/material';
// import themes from '../app/themes';
import { useParams, useSearchParams  } from 'next/navigation';

// Import React Query hooks
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Define the Flashcard type
type Flashcard = {
  id: number; // This will be the array index+1 since MongoDB doesn't assign IDs to array elements
  deckId: string;
  frontText: string; // maps to card.front
  backText: string;  // maps to card.back
  imageUrl: string | null;
  videoUrl: string | null;
  audioUrl: string | null;
  status: 'text' | 'image' | 'video' | 'audio';
};


interface BackendCard {
  front: string;
  back: string;
  ease: number | null;
  status: 'new' | 'learning' | 'review';
  step: 1 | 2 | 3 | null;
  interval: number;
  scheduled_review: Date | null;
}

// And an interface for the deck data from the backend
interface DeckData {
  _id: string;
  deck_name: string;
  auther: string;
  creation_date: string;
  isPublic: boolean;
  tags: string[];
  cards: BackendCard[];
  description: string;
}

// API functions for flashcards with proper type annotations
const fetchFlashcards = async (deckId: string): Promise<Flashcard[]> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/decks/${deckId}`, {
    method: 'GET',
    credentials: 'include',
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch deck');
  }
  
  const deckData: DeckData = await response.json();
  
  // Now TypeScript knows the structure of card
  return (deckData.cards || []).map((card: BackendCard, index: number) => ({
    id: index + 1,
    deckId: deckId,
    frontText: card.front,
    backText: card.back,
    imageUrl: null,
    videoUrl: null,
    audioUrl: null,
    status: 'text' as const
  }));
};

const addFlashcard = async (deckId: string, flashcard: Omit<Flashcard, 'id' | 'deckId'>): Promise<Flashcard> => {
  // First, get the current deck
  const deckResponse = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/decks/${deckId}`, {
    method: 'GET',
    credentials: 'include',
  });
  
  if (!deckResponse.ok) {
    throw new Error('Failed to fetch deck');
  }
  
  const deckData: DeckData = await deckResponse.json();
  
  // Convert frontend flashcard to backend card schema
  const newCard: BackendCard = {
    front: flashcard.frontText,
    back: flashcard.backText,
    ease: null,
    status: 'new',
    step: null,
    interval: 0,
    scheduled_review: null
  };
  
  // Add the new card to the cards array
  const updatedCards = [...(deckData.cards || []), newCard];
  
  // Update the deck with the new cards array
  const updateResponse = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/decks/${deckId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ ...deckData, cards: updatedCards }),
  });
  
  if (!updateResponse.ok) {
    throw new Error('Failed to add flashcard');
  }
  
  // Return the new flashcard with a generated ID
  return {
    id: updatedCards.length,
    deckId,
    frontText: flashcard.frontText,
    backText: flashcard.backText,
    imageUrl: flashcard.imageUrl,
    videoUrl: flashcard.videoUrl,
    audioUrl: flashcard.audioUrl,
    status: flashcard.status
  };
};

const updateFlashcard = async (deckId: string, flashcard: Flashcard): Promise<Flashcard> => {
  // First, get the current deck
  const deckResponse = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/decks/${deckId}`, {
    method: 'GET',
    credentials: 'include',
  });
  
  if (!deckResponse.ok) {
    throw new Error('Failed to fetch deck');
  }
  
  const deckData: DeckData = await deckResponse.json();
  const cards: BackendCard[] = [...(deckData.cards || [])];
  
  // Check if the index is valid (flashcard.id should be index+1)
  const index = flashcard.id - 1;
  if (index < 0 || index >= cards.length) {
    throw new Error('Invalid flashcard ID');
  }
  
  // Update the card at the specified index
  cards[index] = {
    ...cards[index],
    front: flashcard.frontText,
    back: flashcard.backText
    // You may need to handle media fields here
  };
  
  // Update the deck with the modified cards array
  const updateResponse = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/decks/${deckId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ ...deckData, cards }),
  });
  
  if (!updateResponse.ok) {
    throw new Error('Failed to update flashcard');
  }
  
  return flashcard;
};

const deleteFlashcard = async (deckId: string, id: number): Promise<number> => {
  // First, get the current deck
  const deckResponse = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/decks/${deckId}`, {
    method: 'GET',
    credentials: 'include',
  });
  
  if (!deckResponse.ok) {
    throw new Error('Failed to fetch deck');
  }
  
  const deckData: DeckData = await deckResponse.json();
  
  // Remove the card at the specified index (id-1)
  const index = id - 1;
  if (index < 0 || index >= (deckData.cards || []).length) {
    throw new Error('Invalid flashcard ID');
  }
  
  const updatedCards = [
    ...deckData.cards.slice(0, index),
    ...deckData.cards.slice(index + 1)
  ];
  
  // Update the deck with the modified cards array
  const updateResponse = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/decks/${deckId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ ...deckData, cards: updatedCards }),
  });
  
  if (!updateResponse.ok) {
    throw new Error('Failed to delete flashcard');
  }
  
  return id;
};

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

export default function CreateFlashcard() {
  //Test
  // const params = useParams<{ deckId: string }>();
  // const deckId = "67ecc624082eb00f942731aa";

  // const params = useSearchParams();
  // const deckId = params.get('deckId') as string;

  const params = useParams();
  const deckId = params.deckId as string;
  

  //Get DeckID
  // const params = useParams<{ deckId: string }>();
  // const deckId = params.deckId as string;

  // Get QueryClient from the context
  const queryClient = useQueryClient();
  
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [open, setOpen] = useState(false);
  const [currentCard, setCurrentCard] = useState<Flashcard | null>(null);

  
  // Fetch deck info 
  const { data: deckInfo } = useQuery({
    queryKey: ['deck', deckId],
    queryFn: async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/decks/${deckId}`, {
        method: 'GET',
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch deck');
      return response.json();
    },
    enabled: !!deckId,
  });

  // Fetch flashcards with React Query - updated to include deckId
  const { 
    data: flashcards = [], 
    isLoading, 
    isError 
  } = useQuery<Flashcard[], Error>({
    queryKey: ['flashcards', deckId],
    queryFn: () => fetchFlashcards(deckId),
    placeholderData: previousData => previousData,
    enabled: !!deckId, // Only run query when deckId is available
  });


  // Mutation for adding a new flashcard - updated for deckId
  const addFlashcardMutation = useMutation({
    mutationFn: (newCard: Omit<Flashcard, 'id' | 'deckId'>) => {
      console.log('Adding flashcard with data:', newCard);
      return addFlashcard(deckId, newCard);
    },
    onSuccess: (newFlashcard) => {
      console.log('Added new flashcard:', newFlashcard);
      queryClient.invalidateQueries({ queryKey: ['flashcards', deckId] });
      setPageCount(prevCount => prevCount + 1);
    },
    onError: (error) => {
      console.error('Error adding flashcard:', error);
      // Log stack trace if available
      if (error instanceof Error) {
        console.error('Stack:', error.stack);
      }
    }
  });

  // Mutation for updating a flashcard - updated for deckId
  const updateFlashcardMutation = useMutation({
    mutationFn: (updatedCard: Flashcard) => updateFlashcard(deckId, updatedCard),
    onSuccess: (updatedFlashcard) => {
      console.log('Updated flashcard:', updatedFlashcard);
      queryClient.invalidateQueries({ queryKey: ['flashcards', deckId] });
    },
    onError: (error) => {
      console.error('Error updating flashcard:', error);
    }
  });

  // Mutation for deleting a flashcard - updated for deckId
  const deleteFlashcardMutation = useMutation({
    mutationFn: (id: number) => deleteFlashcard(deckId, id),
    onSuccess: (deletedId) => {
      console.log('Deleted flashcard with ID:', deletedId);
      queryClient.invalidateQueries({ queryKey: ['flashcards', deckId] });
      setPageCount(prevCount => Math.max(0, prevCount - 1));
      setCurrentPage(prevPage => Math.max(0, prevPage - 1));
    },
    onError: (error) => {
      console.error('Error deleting flashcard:', error);
    }
  });

  const detectFlashcardStatus = (flashcard: Flashcard): 'text' | 'image' | 'video' | 'audio' => {
    if (flashcard.imageUrl) return 'image';
    if (flashcard.videoUrl) return 'video';
    if (flashcard.audioUrl) return 'audio';
    return 'text'; // Default to text if no media exists
  };
  
  const updateCurrentCard = (key: keyof Flashcard, value: string | null) => {
    if (currentCard) {
      setCurrentCard(prev => {
        if (!prev) return null;
        return {
          ...prev,
          [key]: value
        };
      });
    }
  };

  const addNewFlashcard = () => {
    const newFlashcard = { 
      // id: pageCount + 1, 
      frontText: "Front", 
      backText: "Back", 
      imageUrl: null, 
      videoUrl: null, 
      audioUrl: null, 
      status: 'text' as const
    };
    
    // Use the mutation to add the flashcard
    addFlashcardMutation.mutate(newFlashcard);
  };
  
  const removeLastFlashcard = () => {
    if (flashcards.length > 0) {
      const lastFlashcard = flashcards[flashcards.length - 1];
      // Use the mutation to delete the flashcard
      deleteFlashcardMutation.mutate(lastFlashcard.id);
    }
  };

  const [status, setStatus] = useState<'text' | 'image' | 'video' | 'audio'>('text');

  const [fileName, setFileName] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [imageUrl, setImageUrl] = React.useState<string | null>(null);
  const [videoUrl, setVideoUrl] = React.useState<string | null>(null);
  const [audioUrl, setAudioUrl] = React.useState<string | null>(null);

  // Handle file change
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files ? event.target.files[0] : null;
  
    if (selectedFile && currentCard) {
      const fileType = selectedFile.type;
      const fileUrl = URL.createObjectURL(selectedFile);
  
      setError(null);
      setFileName(selectedFile.name);
  
      if (status === 'image' && fileType.startsWith('image/')) {
        setImageUrl(fileUrl);
        updateCurrentCard("imageUrl", fileUrl);
        updateCurrentCard("status", "image");
      } else if (status === 'video' && fileType.startsWith('video/')) {
        setVideoUrl(fileUrl);
        updateCurrentCard("videoUrl", fileUrl);
        updateCurrentCard("status", "video");
      } else if (status === 'audio' && fileType.startsWith('audio/')) {
        setAudioUrl(fileUrl);
        updateCurrentCard("audioUrl", fileUrl);
        updateCurrentCard("status", "audio");
      } else {
        setError(`Please select a valid ${status} file.`);
      }
    }
  };

  const handleEdit = (card: Flashcard) => {
    setCurrentCard({ ...card });
    setCurrentPage(card.id);
    setStatus(card.status); // Set the status based on the card being edited
    setOpen(true);
    
    // Also set the media URLs if they exist
    if (card.imageUrl) setImageUrl(card.imageUrl);
    if (card.videoUrl) setVideoUrl(card.videoUrl);
    if (card.audioUrl) setAudioUrl(card.audioUrl);
  };
  
  const handleClose = () => {
    setOpen(false);
    setCurrentCard(null);
  };

  const handleSave = () => {
    if (currentCard) {
      // Use the mutation to update the flashcard
      updateFlashcardMutation.mutate(currentCard);
    }
    handleClose();
  };

  const handleMediaTypeChange = (newStatus: 'text' | 'image' | 'video' | 'audio') => {
    setStatus(newStatus);
    if (currentCard) {
      // Reset all media URLs
      updateCurrentCard("imageUrl", null);
      updateCurrentCard("videoUrl", null);
      updateCurrentCard("audioUrl", null);
      
      // For text type, keep backText; for media types, set backText to empty
      if (newStatus === 'text') {
        // Keep the existing backText or set default if none exists
        if (!currentCard.backText) {
          updateCurrentCard("backText", "Back");
        }
      } else {
        // Clear backText when switching to media
        updateCurrentCard("backText", "");
      }
      
      // Update the status last
      updateCurrentCard("status", newStatus);
    }
    
    // Reset the UI states
    setFileName(null);
    setError(null);
    setImageUrl(null);
    setVideoUrl(null);
    setAudioUrl(null);
  };
  
  

  // Add this inside your useEffect or component body
  React.useEffect(() => {
    // Simple fetch test
    const testFetch = async () => {
      try {
        console.log('Testing fetch...');
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/decks/${deckId}`, {
          method: 'GET',
          credentials: 'include',
        });
        console.log('Response status:', response.status);
        if (response.ok) {
          const data = await response.json();
          console.log('Fetch successful, data:', data);
        } else {
          console.error('Fetch failed with status:', response.status);
        }
      } catch (error) {
        console.error('Fetch error:', error);
      }
    };
    
    if (deckId) {
      testFetch();
    }
  }, [deckId]);

  // Display loading state
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading flashcards...</div>;
  }

  // Display error state
  if (isError) {
    return <div className="flex justify-center items-center h-screen">Error loading flashcards.</div>;
  }

  //Test
  console.log('Current deckId:', deckId);
  console.log('API URL:', `${process.env.NEXT_PUBLIC_SERVER_URL}/decks/${deckId}`);
  return (
    <div className="relative bg-white overflow-hidden mx-auto shadow-lg min-h-screen">
      {/* Header */}
      {/* <Navbar2 /> */}

      {/* Title */}
      <h2 className="text-center text-3xl font-extrabold text-gray-900 my-4">
        {deckInfo?.deck_name || 'Loading deck...'}
      </h2>


      {/* Flashcard Lists */}
      <TableContainer component={Paper} sx={{ width: '100vw', maxWidth: '100%', overflowX: 'auto' }}>
        <Table size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell>No.</TableCell>
              <TableCell align="right">Front Card</TableCell>
              <TableCell align="right">Back Card Type</TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {flashcards.map((card) => (
              <TableRow
                key={card.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {card.id}
                </TableCell>
                <TableCell align="right">{card.frontText}</TableCell>
                <TableCell align="right">{card.status}</TableCell>
                <TableCell align="right">
                  <Button variant="outlined" onClick={() => handleEdit(card)}>Edit</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      {/* Add and Remove Buttons */}
      <div className="flex justify-center items-center mt-6 gap-8">
        <Button 
          variant="contained"
          onClick={removeLastFlashcard}
          disabled={flashcards.length === 0 || deleteFlashcardMutation.isPending}
        >
          <RemoveIcon />
        </Button>
        <Button 
          variant="contained"
          onClick={addNewFlashcard}
          disabled={addFlashcardMutation.isPending}
        >
          <AddIcon />
        </Button>
      </div>

      {/* Edit Dialog */}
      {/* <ThemeProvider theme={themes}> */}
        <Dialog fullScreen open={open} onClose={handleClose}>
          <DialogTitle className='justify-center flex'>Edit Flashcard</DialogTitle>
          <DialogContent>
            {/* Flashcard */}
            <div className="mx-auto w-[346px] h-[418px] border border-black rounded-2xl overflow-hidden">
              <div className="h-[213px] bg-gray-400 flex items-center justify-center text-3xl font-bold text-gray-900">
                <TextField
                    variant="outlined"
                    multiline
                    fullWidth
                    value={currentCard?.frontText || "Front"}
                    onChange={(e) => updateCurrentCard("frontText", e.target.value)}
                    inputProps={{ className: "text-3xl font-bold text-gray-900 text-center" }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          border: 'none',  // Removes the border
                        },
                      },
                    }}
                  />
              </div>
              {/* show image/video/audio */}
              <div className="h-[205px] bg-white flex items-center justify-center text-3xl font-bold text-black">
                {
                  (() => {
                    switch (status) {
                      case 'image':
                        return (
                          <>
                            {currentCard?.imageUrl && (
                              <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
                                <Image
                                  src={currentCard?.imageUrl}
                                  alt="Uploaded Image"
                                  fill={true}
                                  style={{
                                    objectFit: 'contain',
                                    maxWidth: '100%',
                                    maxHeight: '100%',
                                  }}
                                />
                              </Box>
                            )}
                          </>
                        );
                      case 'video':
                        return (
                          <>
                            {currentCard?.videoUrl && (
                              <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
                                <video
                                  src={currentCard?.videoUrl}
                                  controls
                                  style={{
                                    objectFit: 'contain',
                                    maxWidth: '100%',
                                    maxHeight: '100%',
                                  }}
                                />
                              </Box>
                            )}
                          </>
                        );
                      case 'audio':
                        return (
                          <>
                            {currentCard?.audioUrl && (
                              <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
                                <audio controls>
                                  <source src={currentCard?.audioUrl} />
                                  Your browser does not support the audio element.
                                </audio>
                              </Box>
                            )}
                          </>
                        );
                      case 'text':
                        return <TextField
                        variant="outlined"
                        multiline
                        fullWidth
                        value={currentCard?.backText || "Back"}
                        onChange={(e) => updateCurrentCard("backText", e.target.value)}
                        inputProps={{ className: "text-3xl font-bold text-black text-center" }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                              border: 'none',  
                              },
                            },
                          }}
                        />;
                    }
                  })()
                }
              </div>
            </div>
            {/* Upload buttons */}
            <div className="mx-auto overflow-hidden">
              <div className="bg-white flex items-center justify-center text-3xl font-bold text-black">
                {
                  (() => {
                    switch (status) {
                      case 'image':
                        return (
                          <>
                            <Button
                              component="label"
                              variant="contained"
                              startIcon={<PhotoIcon />}
                              aria-label="Upload image"
                              sx={{ marginBottom: 2 }}
                            >
                              Upload image
                              <VisuallyHiddenInput 
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                multiple={false}
                              />
                            </Button>
                            {fileName ? (
                              <Typography variant="body2" color="textSecondary">
                                Selected file: {fileName}
                              </Typography>
                            ) : null}                            
                            {error && (
                              <Typography variant="body2" color="error">
                                {error}
                              </Typography>
                            )}
                          </>
                        );
                      case 'video':
                        return (
                          <>
                            <Button
                              component="label"
                              variant="contained"
                              startIcon={<VideoLibraryIcon />}
                              aria-label="Upload video"
                              sx={{ marginBottom: 2 }}
                            >
                              Upload video
                              <VisuallyHiddenInput 
                                type="file"
                                accept="video/*"
                                onChange={handleFileChange}
                                multiple={false}
                              />
                            </Button>
                            {fileName ? (
                              <Typography variant="body2" color="textSecondary">
                                Selected file: {fileName}
                              </Typography>
                            ) : null}                            
                            {error && (
                              <Typography variant="body2" color="error">
                                {error}
                              </Typography>
                            )}
                          </>
                        );
                      case 'audio':
                        return (
                          <>
                            <Button
                              component="label"
                              variant="contained"
                              startIcon={<KeyboardVoiceIcon />}
                              aria-label="Upload audio"
                              sx={{ marginBottom: 2 }}
                            >
                              Upload audio
                              <VisuallyHiddenInput 
                                type="file"
                                accept="audio/*"
                                onChange={handleFileChange}
                                multiple={false}
                              />
                            </Button>
                            {fileName ? (
                              <Typography variant="body2" color="textSecondary">
                                Selected file: {fileName}
                              </Typography>
                            ) : null}                            
                            {error && (
                              <Typography variant="body2" color="error">
                                {error}
                              </Typography>
                            )}
                          </>
                        );
                    }
                  })()
                }
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-center gap-4 mt-6 ">
              <Button variant="text" sx={{ border: '1px solid black', width: '40px', height: '40px' }} onClick={() => handleMediaTypeChange('text')}>
                <TitleIcon />
              </Button>
              <Button variant="text" sx={{ border: '1px solid black', width: '40px', height: '40px' }} onClick={() => handleMediaTypeChange('image')}>
                <PhotoIcon />
              </Button>
              <Button variant="text" sx={{ border: '1px solid black', width: '40px', height: '40px' }} onClick={() => handleMediaTypeChange('video')}>
                <VideoLibraryIcon />
              </Button>
              <Button variant="text" sx={{ border: '1px solid black', width: '40px', height: '40px' }} onClick={() => handleMediaTypeChange('audio')}>
                <KeyboardVoiceIcon />
              </Button>
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button 
              variant="contained" 
              onClick={handleSave}
              disabled={updateFlashcardMutation.isPending}
            >
              {/* Save */}
              {updateFlashcardMutation.isPending ? 'Saving...' : 'Save'}
            </Button>
          </DialogActions>
        </Dialog>
      {/* </ThemeProvider> */}
      {addFlashcardMutation.isError && (
        <div className="text-red-500 mt-2">
          Error: {addFlashcardMutation.error.message}
        </div>
      )}
      <div className="mt-8 p-4 bg-gray-100 rounded">
        <h3 className="text-lg font-bold">Debug Info:</h3>
        <p>Flashcards count: {flashcards.length}</p>
        <p>Current page: {currentPage}</p>
        <p>Fetching status: {isLoading ? 'loading' : isError ? 'error' : 'success'}</p>
        <p>Add mutation status: {addFlashcardMutation.isPending ? 'pending' : addFlashcardMutation.isError ? 'error' : addFlashcardMutation.isSuccess ? 'success' : 'idle'}</p>
      </div>
    </div>
  );
}