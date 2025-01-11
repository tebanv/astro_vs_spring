package co.com.savia.model.user;
import lombok.*;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class User {

    private Long id;
    private String email;
    private String password;
    private String name;
    private String role;
}
