import React, { useState, useEffect } from "react";
import { Box, Button, Container, Heading, Select, SimpleGrid, VStack, RadioGroup, Radio, Stack, useToast } from "@chakra-ui/react";

const scales = {
  Major: [2, 2, 1, 2, 2, 2, 1],
  Minor: [2, 1, 2, 2, 1, 2, 2],
  HarmonicMinor: [2, 1, 2, 2, 1, 3, 1],
  PentatonicMajor: [2, 2, 3, 2, 3],
  PentatonicMinor: [3, 2, 2, 3, 2],
  Blues: [3, 2, 1, 1, 3, 2],
  MelodicMinor: [2, 1, 2, 2, 2, 2, 1],
};

const notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

const Index = () => {
  const [selectedScale, setSelectedScale] = useState("Major");
  const [rootNote, setRootNote] = useState("C");
  const [lastNote, setLastNote] = useState(rootNote);
  const [outputType, setOutputType] = useState("MIDI");
  const toast = useToast();

  useEffect(() => {
    setLastNote(rootNote);
  }, [rootNote]);

  const handleRootNoteChange = (event) => {
    setRootNote(event.target.value);
  };

  const handleScaleChange = (event) => {
    setSelectedScale(event.target.value);
  };

  const handleOutputChange = (value) => {
    setOutputType(value);
  };

  const playNote = (noteIndex) => {
    const note = notes[(notes.indexOf(lastNote) + noteIndex + 12) % 12];
    setLastNote(note);
    // This is where you would implement the logic to play a note using MIDI or the sound engine
    toast({
      title: `Note ${note} played`,
      description: `Output: ${outputType}`,
      status: "info",
      duration: 2000,
      isClosable: true,
    });
  };

  return (
    <Container maxW="container.md" py={10}>
      <VStack spacing={6}>
        <Heading>Unique Musical Keyboard</Heading>

        <Select placeholder="Select root note" value={rootNote} onChange={handleRootNoteChange} mb={4}>
          {notes.map((note) => (
            <option key={note} value={note}>
              {note}
            </option>
          ))}
        </Select>

        <Select placeholder="Select scale" value={selectedScale} onChange={handleScaleChange}>
          {Object.keys(scales).map((scale) => (
            <option key={scale} value={scale}>
              {scale}
            </option>
          ))}
        </Select>

        <RadioGroup onChange={handleOutputChange} value={outputType}>
          <Stack direction="row">
            <Radio value="MIDI">MIDI Output</Radio>
            <Radio value="SoundEngine">Sound Engine</Radio>
          </Stack>
        </RadioGroup>

        <Box border="1px" borderColor="gray.200" p={3} mb={4} w="full" textAlign="center">
          Last Played Note: {lastNote}
        </Box>

        <SimpleGrid columns={9} spacing={2} mb={4}>
          {Array.from({ length: 9 }, (_, i) => i - 4).map((note) => (
            <Button key={note} onClick={() => playNote(note)}>
              {note >= 0 ? `+${note}` : note}
            </Button>
          ))}
        </SimpleGrid>
      </VStack>
    </Container>
  );
};

export default Index;
