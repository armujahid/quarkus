package io.quarkus.smallrye.reactivemessaging.blocking.beans;

import java.util.ArrayList;
import java.util.List;

import javax.enterprise.context.ApplicationScoped;

import org.eclipse.microprofile.reactive.messaging.Incoming;
import org.eclipse.microprofile.reactive.streams.operators.ReactiveStreams;
import org.eclipse.microprofile.reactive.streams.operators.SubscriberBuilder;

@ApplicationScoped
public class InfiniteSubscriber {

    private final List<Integer> payloads = new ArrayList<>();
    private final List<Integer> messages = new ArrayList<>();

    @Incoming("infinite-producer-payload")
    public SubscriberBuilder<Integer, Void> consumeFourItems() {
        return ReactiveStreams
                .<Integer> builder()
                .limit(4)
                .forEach(payloads::add);
    }

    @Incoming("infinite-producer-msg")
    public SubscriberBuilder<Integer, Void> consumeFourMessages() {
        return ReactiveStreams
                .<Integer> builder()
                .limit(4)
                .forEach(messages::add);
    }

    public List<Integer> payloads() {
        return payloads;
    }

    public List<Integer> messages() {
        return messages;
    }

}
