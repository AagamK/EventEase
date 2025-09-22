import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { fetchEvents, createEvent, updateEvent } from '../store/slices/eventSlice';
import { useCallback } from 'react';
import { Event } from '../types';

export const useEvents = () => {
  const dispatch = useDispatch();
  const { events, currentEvent, isLoading, error } = useSelector(
    (state: RootState) => state.events
  );

  const getEvents = useCallback(() => {
    dispatch(fetchEvents() as any);
  }, [dispatch]);

  const addEvent = useCallback(
    (eventData: Partial<Event>) => {
      return dispatch(createEvent(eventData) as any);
    },
    [dispatch]
  );

  const editEvent = useCallback(
    (id: number, eventData: Partial<Event>) => {
      return dispatch(updateEvent({ id, eventData }) as any);
    },
    [dispatch]
  );

  return {
    events,
    currentEvent,
    isLoading,
    error,
    getEvents,
    createEvent: addEvent,
    updateEvent: editEvent,
  };
};