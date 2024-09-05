"use client";
import React, { use, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { set } from "mongoose";
import { useForm } from "react-hook-form";
import { sendMessageSchema } from "@/schemas/sendMessageSchema";
import { zodResolver } from "@hookform/resolvers/zod";

export default function page() {
  const params = useParams();
  const username = params.username;
  const { toast } = useToast();
  const form = useForm({
    resolver: zodResolver(sendMessageSchema),
  });

  const [isLoading, setIsLoading] = useState(false);
  const [suggestedMessages, setSuggestedMessages] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const initialMessageString =
    "What's your favorite movie?||Do you have any pets?||What's your dream job?";

  const initialMessage = initialMessageString.split("||");

  const handleSuggestMessage = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post<ApiResponse>(`/api/suggest-messages`);

      setSuggestedMessages(response.data.code?.split("||") || []);
      toast({
        title: "Suggested messages",
        description: "Your suggested messages have been fetched",
      });

      setIsLoading(false);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description: axiosError.response?.data.message,
        variant: "destructive",
      });
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    setIsSendingMessage(true);
    try {
      await axios.post<ApiResponse>(`/api/send-message`, {
        username,
        content: message,
      });

      toast({
        title: "Message sent",
        description: "Your message has been sent",
      });
      setMessage("");
      setIsSendingMessage(false);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description: axiosError.response?.data.message,
        variant: "destructive",
      });
      setIsSendingMessage(false);
    } finally {
      setIsSendingMessage(false);
    }
  };

  const handleTextAre = (message: string) => {
    if (message.length === 0) {
      setMessage(message);
    } else {
      setMessage((prevMessage) => `${prevMessage} ${message}`);
    }
  };

  return (
    <>
      <div>
        <h1 className="text-center text-4xl font-bold py-5">
          Public Profile Link
        </h1>
        <div>
          <h3 className="mb-2 font-bold">
            Send Anonymous Message to @{username}
          </h3>
          <Textarea
            placeholder="Type your message here..."
            onChange={(e) => setMessage(e.target.value)}
            value={message}
          />
        </div>
        <div className="w-full flex justify-center my-2">
          {isSendingMessage ? (
            <Button>
              <Loader2 className="animate-spin h-4 w-28" />
            </Button>
          ) : (
            <Button onClick={handleSendMessage}>Send</Button>
          )}
        </div>
        <div>
          {isLoading ? (
            <Button className="mt-6 ml-4">
              <Loader2 className="animate-spin h-4 w-28" />
            </Button>
          ) : (
            <Button className="mt-6 ml-4" onClick={handleSuggestMessage}>
              Suggest Messages
            </Button>
          )}
        </div>
        <p className="mt-4">Click on message below to select it.</p>

        <div className="border-2 border-gray-300 rounded-lg p-4 mt-4">
          <h3 className="font-bold">Messages</h3>
          <div className="flex flex-col gap-4 mt-4 justify-center items-center">
            {suggestedMessages.length > 0
              ? suggestedMessages.map((message, index) => (
                  <div
                    className="flex gap-4 items-center cursor-pointer"
                    key={index}
                  >
                    <div className="border-2 border-gray-300 rounded-lg p-2 w-full">
                      <p
                        className="font-bold"
                        onClick={() => handleTextAre(message)}
                      >
                        {message}
                      </p>
                    </div>
                  </div>
                ))
              : initialMessage.map((message, index) => (
                  <div
                    className="flex gap-4 items-center cursor-pointer"
                    key={index}
                  >
                    <div className="border-2 border-gray-300 rounded-lg p-2 w-full">
                      <p
                        className="font-bold"
                        onClick={() => handleTextAre(message)}
                      >
                        {message}
                      </p>
                    </div>
                  </div>
                ))}
          </div>
        </div>
      </div>
    </>
  );
}
