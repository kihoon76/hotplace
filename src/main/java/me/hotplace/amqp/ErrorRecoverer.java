package me.hotplace.amqp;

import org.springframework.amqp.core.Message;
import org.springframework.amqp.rabbit.retry.RejectAndDontRequeueRecoverer;
import org.springframework.stereotype.Component;

@Component("recoverer")
public class ErrorRecoverer extends RejectAndDontRequeueRecoverer {

	@Override
	public void recover(Message message, Throwable cause) {
		
	}
}
