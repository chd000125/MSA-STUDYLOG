package com.studylog.users.repository;

import com.studylog.users.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByuEmail(String email);
    Optional<User> findByuId(Long uId);
    List<User> findByDeletedAtBefore(LocalDateTime dateTime);

    @Query("""
        SELECT u FROM User u
        WHERE (:uId IS NULL OR u.uId = :uId)
          AND (:uName IS NULL OR u.uName LIKE %:uName%)
          AND (:uEmail IS NULL OR u.uEmail LIKE %:uEmail%)
    """)
    Page<User> searchUsers(Long uId, String uName, String uEmail, Pageable pageable);
}
