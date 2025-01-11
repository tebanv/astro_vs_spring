package co.com.savia.repository;

import co.com.savia.model.UserEntity;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface UserRepository  extends CrudRepository<UserEntity, Long> {
    Optional<UserEntity> findByEmail(String email);
}
