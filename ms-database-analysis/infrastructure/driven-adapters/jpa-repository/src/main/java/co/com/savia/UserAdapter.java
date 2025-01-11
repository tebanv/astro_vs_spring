package co.com.savia;

import co.com.savia.model.UserEntity;
import co.com.savia.model.user.User;
import co.com.savia.model.user.gateways.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Log4j2
@Service
@RequiredArgsConstructor
public class UserAdapter implements UserRepository {

    public final co.com.savia.repository.UserRepository userRepository;

    @Override
    public User findByEmail(String email) {
        Optional<UserEntity> userEntity = userRepository.findByEmail(email);
        if (userEntity.isEmpty()) {
            return null;
        } else {
            UserEntity userEntity1 = userEntity.get();
            return User.builder()
                    .id(userEntity1.getId())
                    .email(userEntity1.getEmail())
                    .name(userEntity1.getName())
                    .password(userEntity1.getPassword())
                    .role(userEntity1.getRole())
                    .build();
        }

    }
}
