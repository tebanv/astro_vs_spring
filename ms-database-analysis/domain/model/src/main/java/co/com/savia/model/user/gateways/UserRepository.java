package co.com.savia.model.user.gateways;

import co.com.savia.model.user.User;


public interface UserRepository {

    User findByEmail(String email);
}
