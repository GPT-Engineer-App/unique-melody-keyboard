import React, { useState, useEffect, useCallback } from "react";
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
  let midiAccess = null;
  let midiOutput = null;

  const getMIDIAccess = async () => {
    if (navigator.requestMIDIAccess) {
      try {
        midiAccess = await navigator.requestMIDIAccess({ sysex: false });
        midiOutput = midiAccess.outputs.values().next().value;
      } catch (error) {
        console.error("MIDI Access not supported", error);
      }
    } else {
      console.error("Web MIDI API not supported");
    }
  };

  useEffect(() => {
    getMIDIAccess();
  }, []);

  const sendMIDIMessage = (note) => {
    const noteOnMessage = [0x90, note, 0x7f];
    const noteOffMessage = [0x80, note, 0x00];
    if (midiOutput) {
      midiOutput.send(noteOnMessage);
      midiOutput.send(noteOffMessage, window.performance.now() + 1000.0);
    }
  };

  const playSound = (note) => {
    const midiNote = notes.indexOf(note) + 60;
    sendMIDIMessage(midiNote);
  };

  const handleKeyPress = useCallback((event) => {
    const keyMap = {
      a: -4,
      s: -3,
      d: -2,
      f: -1,
      g: 0,
      h: 1,
      j: 2,
      k: 3,
      l: 4,
    };
    if (keyMap[event.key] !== undefined) {
      playNote(keyMap[event.key]);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);
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

  const playNote = (step) => {
    const scaleIntervals = scales[selectedScale];
    let noteIndex = notes.indexOf(rootNote);
    for (let i = 0; i < Math.abs(step); i++) {
      noteIndex = (noteIndex + scaleIntervals[i % scaleIntervals.length] * Math.sign(step) + notes.length) % notes.length;
    }
    const note = notes[noteIndex];
    setLastNote(note);
    toast({
      title: `Note ${note} played`,
      description: `Output: ${outputType}`,
      status: "info",
      duration: 2000,
      isClosable: true,
    });
    if (outputType === "MIDI") {
      playSound(note);
    }
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
