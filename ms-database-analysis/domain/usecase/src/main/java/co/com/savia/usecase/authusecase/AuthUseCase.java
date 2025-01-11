package co.com.savia.usecase.authusecase;

import co.com.savia.model.user.User;
import co.com.savia.model.user.gateways.UserRepository;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class AuthUseCase {

    private final UserRepository userRepository;

    public User findByEmail(String email) {
        return userRepository.findByEmail(email);
    }
}
