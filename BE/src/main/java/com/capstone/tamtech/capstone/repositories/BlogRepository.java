package com.capstone.tamtech.capstone.repositories;

import com.capstone.tamtech.capstone.entities.Blog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BlogRepository extends JpaRepository<Blog, Integer> {

    List<Blog> findByAuthorId(int authorId);

    List<Blog> findByBlogTypeId(int blogTypeId);
}
